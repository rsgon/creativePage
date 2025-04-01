# Project Setup Guide

## 1. Install Dependencies
Run the following command to install all required dependencies:
```sh
npm install
```

## 2. Install Required Tools
Ensure you have the necessary testing tools installed:
```sh
npm install --save-dev selenium-webdriver mocha chai chromedriver
```

## 3. Verify WebDriver & Chrome Versions
Make sure your Chrome and ChromeDriver versions are compatible:
```sh
google-chrome --version  # Check Chrome version
npx chromedriver --version  # Check ChromeDriver version
```

## 4. Run Tests
Execute the test suite using:
```sh
npm test
```
Now you're ready to start working on the project! 

