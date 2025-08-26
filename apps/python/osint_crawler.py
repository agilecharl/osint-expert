import asyncio
import re
import logging
from typing import List, Dict, Set
from urllib.parse import urljoin, urlparse
import psycopg2
from psycopg2.extras import RealDictCursor
from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import LLMExtractionStrategy
import json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

category = 'osint'
category_id = None

class OSINTToolsCrawler:
    def __init__(self, db_config: Dict[str, str]):
        self.db_config = db_config
        self.visited_urls: Set[str] = set()
        self.crawled_domains: Set[str] = set()
        self.max_depth = 3
        self.max_pages_per_domain = 10
        
        # OSINT-related keywords for filtering relevant pages
        self.osint_keywords = [
            'osint', 'intelligence', 'investigation', 'reconnaissance', 
            'cyber', 'security', 'forensics', 'analysis', 'surveillance',
            'social media', 'geolocation', 'metadata', 'dark web',
            'threat intelligence', 'investigation tools', 'security tools'
        ]
        
    def get_db_connection(self):
        """Create database connection"""
        return psycopg2.connect(**self.db_config)
    
    def is_osint_relevant(self, text: str, url: str) -> bool:
        """Check if content is OSINT-related"""
        text_lower = text.lower()
        url_lower = url.lower()
        
        # Check URL for OSINT indicators
        url_indicators = any(keyword in url_lower for keyword in self.osint_keywords)
        
        # Check content for OSINT keywords (more flexible matching)
        content_score = sum(text_lower.count(keyword) for keyword in self.osint_keywords)
        
        return url_indicators or content_score >= 3
    
    def extract_links(self, html_content: str, base_url: str) -> List[str]:
        """Extract all links from HTML content"""
        # Simple regex to find href attributes
        link_pattern = r'href=["\']([^"\']+)["\']'
        links = re.findall(link_pattern, html_content, re.IGNORECASE)
        
        absolute_links = []
        for link in links:
            absolute_url = urljoin(base_url, link)
            if self.is_valid_url(absolute_url):
                absolute_links.append(absolute_url)
        
        return list(set(absolute_links))  # Remove duplicates
    
    def is_valid_url(self, url: str) -> bool:
        """Check if URL is valid and crawlable"""
        try:
            parsed = urlparse(url)
            if not parsed.scheme or not parsed.netloc:
                return False
            
            # Skip certain file types
            skip_extensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', 
                             '.zip', '.rar', '.tar', '.gz', '.jpg', '.jpeg', '.png', '.gif']
            
            if any(url.lower().endswith(ext) for ext in skip_extensions):
                return False
                
            return True
        except Exception:
            return False
    
    def extract_osint_tools(self, content: str, url: str) -> List[Dict[str, str]]:
        """Extract OSINT tools from webpage content using LLM"""
        
        try:
            # This is a simplified extraction - you might want to use a more sophisticated approach
            tools = []
            
            # Basic pattern matching for common tool formats
            patterns = [
                r'(?:Tool|Software|Website|Service):\s*([^-\n]+)\s*[-–]\s*([^\n]+)',
                r'(?:\*\*|##)\s*([^*#\n]+)(?:\*\*|##)?\s*[-–]?\s*([^\n]+)',
                r'(?:\d+\.)\s*([^-\n]+)\s*[-–]\s*([^\n]+)'
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, content, re.MULTILINE | re.IGNORECASE)
                for match in matches:
                    if len(match) >= 2:
                        tool_name = match[0].strip()
                        description = match[1].strip()
                        
                        # Basic validation
                        if (len(tool_name) > 2 and len(description) > 10 and 
                            any(keyword in (tool_name + description).lower() 
                                for keyword in self.osint_keywords)):
                            
                            tools.append({
                                'tool': tool_name,
                                'description': description,
                                'url': url
                            })
            
            return tools
            
        except Exception as e:
            logger.error(f"Error extracting tools from {url}: {str(e)}")
            return []
    
    def save_tools_to_db(self, tools: List[Dict[str, str]]):
        """Save extracted tools to database"""
        if not tools:
            return

        try:
            conn = self.get_db_connection()
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT id FROM osint.categories WHERE category = %s", ('Weblink Types',))
            category_row = cursor.fetchone()
            category_id = category_row['id'] if category_row else None

            code_id = None
            if category_id:
                cursor.execute("SELECT id FROM osint.codes WHERE category = %s AND code = %s", (category_id, 'OSINT Tool'))
                code_row = cursor.fetchone()
                code_id = code_row['id'] if code_row else None

            for tool in tools:
                # Check if tool already exists
                cursor.execute(
                    "SELECT COUNT(*) FROM osint.tools WHERE url = %s",
                    (tool['url'],)
                )

                if cursor.fetchone()[0] == 0:
                    cursor.execute(
                        "INSERT INTO osint.stage_weblinks (url, weblink_type, title, description) VALUES (%s, %s, %s, %s)",
                        (tool['url'], code_id, tool['tool'], tool['description'])
                    )
                    logger.info(f"Added tool: {tool['tool']}")

            conn.commit()
            cursor.close()
            conn.close()

        except Exception as e:
            logger.error(f"Error saving tools to database: {str(e)}")
    
    async def crawl_page(self, url: str, depth: int = 0) -> List[str]:
        """Crawl a single page and extract tools and links"""
        if url in self.visited_urls or depth > self.max_depth:
            return []
        
        self.visited_urls.add(url)
        domain = urlparse(url).netloc
        
        # Limit pages per domain
        domain_count = sum(1 for visited_url in self.visited_urls 
                          if urlparse(visited_url).netloc == domain)
        if domain_count > self.max_pages_per_domain:
            return []
        
        logger.info(f"Crawling: {url} (depth: {depth})")
        
        try:
            async with AsyncWebCrawler(verbose=True) as crawler:
                result = await crawler.arun(url=url)
                
                if not result.success:
                    logger.warning(f"Failed to crawl {url}: {result.error_message}")
                    return []
                
                content = result.markdown or result.html
                
                # Check if content is OSINT-relevant
                if not self.is_osint_relevant(content, url):
                    logger.info(f"Skipping non-OSINT page: {url}")
                    return []
                
                # Extract OSINT tools
                tools = self.extract_osint_tools(content, url)
                if tools:
                    self.save_tools_to_db(tools)
                    logger.info(f"Found {len(tools)} tools on {url}")
                
                # Extract links for further crawling
                links = self.extract_links(result.html, url)
                
                # Filter links to focus on potentially relevant pages
                relevant_links = [link for link in links 
                                if any(keyword in link.lower() for keyword in self.osint_keywords)]
                
                return relevant_links[:20]  # Limit links per page
                
        except Exception as e:
            logger.error(f"Error crawling {url}: {str(e)}")
            return []
    
    def get_seed_urls(self) -> List[str]:
        """Get seed URLs from database"""
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT url FROM osint.tools WHERE url IS NOT NULL LIMIT 1")
            urls = [row[0] for row in cursor.fetchall()]
            cursor.close()
            conn.close()
            return urls
        except Exception as e:
            logger.error(f"Error getting seed URLs: {str(e)}")
            return []
    
    async def run_crawler(self):
        """Main crawling function"""
        logger.info("Starting OSINT tools crawler...")
        
        # Get seed URLs from database
        seed_urls = self.get_seed_urls()
        
        if not seed_urls:
            logger.warning("No seed URLs found in database. Please add some initial URLs.")
            return
        
        # Queue for URLs to crawl
        crawl_queue = list(seed_urls)
        depth = 0
        
        while crawl_queue and depth <= self.max_depth:
            current_batch = crawl_queue[:50]  # Process in batches
            crawl_queue = crawl_queue[50:]
            
            logger.info(f"Processing batch of {len(current_batch)} URLs at depth {depth}")
            
            # Crawl pages concurrently
            tasks = [self.crawl_page(url, depth) for url in current_batch]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Collect new links
            for result in results:
                if isinstance(result, list):
                    crawl_queue.extend(result)
            
            depth += 1
            
            # Remove duplicates and already visited URLs
            crawl_queue = list(set(crawl_queue) - self.visited_urls)
        
        logger.info(f"Crawling completed. Visited {len(self.visited_urls)} pages.")

# Example usage
async def main():
    # Database configuration
    db_config = {
        'host': 'localhost',
        'database': 'osint',
        'user': 'osint',
        'password': 'osint',
        'port': 5432
    }
    
    # Initialize crawler
    crawler = OSINTToolsCrawler(db_config)
    
    # Run the crawler
    await crawler.run_crawler()

if __name__ == "__main__":
    asyncio.run(main())