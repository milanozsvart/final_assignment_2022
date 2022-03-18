from bs4 import BeautifulSoup
import requests
import pandas as pd
from playwright.sync_api import sync_playwright

attributesDict = {
    'surName': {'className': 'span.players-sticky-header__player-lname', 'type': 'span'},
    'firstName': {'className': 'span.profile-header-info__firstname', 'type': 'span'},
    'rank': {'className': 'span.profile-header-image-col__rank-pos', 'type': 'span', 'dataAttribute': 'data-single'},
    'nationality': {'className': 'div.profile-header-info__nationalityCode', 'type': 'div'},
}

#source = requests.get('https://www.wtatennis.com/sitemap/players.xml').text
source = open('players.xml', 'r')

soup = BeautifulSoup(source, 'lxml')
outPutFile = open("players_2022_03.csv", "a+", encoding="utf-8")

playerWebsiteLinks = soup.find_all('loc')
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    for link in playerWebsiteLinks:
        try:
            page.goto(link.text)
        except:
            continue
        for attribute in attributesDict.keys():
            try:
                attributeToFind = page.locator(
                    f"{attributesDict[attribute]['className']}")
                if 'dataAttribute' in attributesDict[attribute].keys():
                    outPutFile.write(attributeToFind.get_attribute(
                        attributesDict[attribute]['dataAttribute']).strip() + ",")
                else:
                    outPutFile.write(
                        attributeToFind.text_content().strip() + ",")
            except:
                outPutFile.write(",")
        outPutFile.write("\n")
