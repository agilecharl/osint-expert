import psycopg2
import logging
import json
import asyncio

from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import LLMExtractionStrategy
#from serpapi import GoogleSearch
from urllib.parse import urljoin
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG = {
    'dbname': 'osint',
    'user': 'osint',  # Replace with your PostgreSQL username
    'password': 'osint',  # Replace with your PostgreSQL password
    'host': 'localhost',
    'port': '5432'
}

# SerpAPI configuration
SERPAPI_KEY = 'your_serpapi_key'  # Replace with your SerpAPI key

# Initialize Crawl4AI crawler
crawler = AsyncWebCrawler()

def connect_db():
    """Connect to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        logger.info("Connected to PostgreSQL database")
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise

def fetch_urls_from_db(conn):
    """Fetch URLs from the osint.tools table."""
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT link FROM osint.tools WHERE link IS NOT NULL")
            urls = [row[0] for row in cur.fetchall()]
        logger.info(f"Fetched {len(urls)} URLs from database")
        return urls
    except Exception as e:
        logger.error(f"Error fetching URLs from database: {e}")
        return []

'''
def search_osint_tools():
    """Search for OSINT tools using SerpAPI."""
    try:

        params = {
            'q': 'OSINT tools site:*.org | site:*.edu | site:*.gov -inurl:(signup | login)',
            'api_key': SERPAPI_KEY,
            'num': 10
        }

        #search = GoogleSearch(params)
        #results = search.get_dict().get('organic_results', [])
        #urls = [result['link'] for result in results]
        #logger.info(f"Found {len(urls)} URLs from search engine")
        #return urls
    except Exception as e:
        logger.error(f"Search engine error: {e}")
        return []
'''

def extract_tools_from_page(url):
    """Extract OSINT tool information from crawled content."""
    async def run_extraction():
        try:
            schema = {
                "name": "OSINT Tool Extractor",
                "description": "Extracts OSINT tools and their descriptions from a webpage.",
                "parameters": {
                    "tools": [
                        {
                            "name": {"type": "string", "description": "Name of the OSINT tool"},
                            "description": {"type": "string", "description": "Description of the tool"},
                            "url": {"type": "string", "description": "URL of the tool"}
                        }
                    ]
                }
            }
            
            strategy = LLMExtractionStrategy(
                schema=schema,
                instruction="Extract all OSINT tools mentioned on the page, including their names, descriptions, and URLs."
            )
            
            result = await crawler.arun(
                url=url,
                extraction_strategy=strategy,
                bypass_cache=True
            )
            
            if result.success:
                tools = result.extracted_content.get('tools', []) if result.extracted_content else []
                for tool in tools:
                    tool['source_url'] = url
                return tools
            else:
                logger.warning(f"Failed to crawl {url}")
                return []
        except Exception as e:
            logger.error(f"Error extracting tools from {url}: {e}")
            return []
    # Fix for Windows event loop issue
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(run_extraction())

def save_tools_to_db(conn, tools):
    """Save extracted tools to the database."""
    try:
        with conn.cursor() as cur:
            for tool in tools:
                cur.execute(
                    """
                    INSERT INTO osint.tools (name, description, link, source_url)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (link) DO NOTHING
                    """,
                    (tool.get('name'), tool.get('description'), tool.get('url'), tool.get('source_url'))
                )
        conn.commit()
        logger.info(f"Saved {len(tools)} tools to database")
    except Exception as e:
        logger.error(f"Error saving tools to database: {e}")
        conn.rollback()

def main():
    """Main function to run the OSINT tools crawler."""
    # Connect to database
    conn = connect_db()
    
    # Fetch initial URLs from database
    urls = fetch_urls_from_db(conn)
    
    # Add URLs from search engine
    #urls.extend(search_osint_tools())
    
    # Deduplicate URLs
    urls = list(set(urls))
    logger.info(f"Total unique URLs to crawl: {len(urls)}")
    
    all_tools = []
    # Process up to 10 URLs
    for url in urls[:10]:
        logger.info(f"Crawling {url}")
        tools = extract_tools_from_page(url)
        all_tools.extend(tools)
    
    # Save results to database
    if all_tools:
        save_tools_to_db(conn, all_tools)
    
    # Save results to a JSON file for backup
    with open('osint_tools.json', 'w') as f:
        json.dump(all_tools, f, indent=2)
    logger.info(f"Saved {len(all_tools)} tools to osint_tools.json")
    
    conn.close()
    logger.info("Database connection closed")

if __name__ == "__main__":
    main()