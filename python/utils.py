from lxml import html
import requests
from time import sleep
import csv
import random
from selenium import webdriver
from selenium.common.exceptions import TimeoutException

def generate_random_proxy(filepath):
    list_of_proxies = []
    with open(filepath) as proxy_file:
        for i in proxy_file:
            line = proxy_file.readline()
            list_of_proxies.append(line.strip())
    return random.choice(list_of_proxies)

def sort_and_remove_duplicates_from_list(input_list):
    

    input_list = sorted(input_list)
    output_list = []
    i = 0

    while i < len(input_list) -1:
        if (input_list[i] == input_list[i+1]):
            del input_list[i+1]
            i -= 1
        i += 1

    for item in input_list:
        output_list.append(item)
    return output_list

