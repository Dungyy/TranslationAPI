# Text Translator API 

A powerful, easy-to-use command-line tool & API Endpoint for translating text between languages using the Google Translate API. Designed for developers, researchers, and anyone in need of quick language translation, this project offers a straightforward way to integrate translation features into any project.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Features

- **Wide Language Support:** Utilizes Google Translate to support a vast array of languages.
- **Simple CLI Interface:** Offers an intuitive command-line interface for easy operation.
- **Full-Word Language Specification:** Utilizes entire language names (e.g., "Spanish") instead of abbreviations, enhancing clarity.
- **Seamless Integration:** Can be easily integrated into other Python scripts or web applications for dynamic translation services.

## Getting Started

Follow these instructions to get Text Translator running on your local machine for development and testing purposes.

## Prerequisites

- Python 3.6 or later
- Node.js v14+
- pip3 (Python Package Installer)

## Installation

1. ### Clone the Repository


    ```sh
   git clone https://github.com/dungyy/TranslationAPI.git
   cd text-translator

2. ### Use env for python packages

   ```sh 
   python -m venv env

   source env/bin/activate

2. ### Download the dependencies

   ```sh 
   pip install -r requirements.txt
   bun install

## Usage

### Python
```sh
python3 "<file_to_translate>" "<source_language>" "<target_language>"
```
```
example: python3 translate_script.py example.txt en es 
```
### NodeJs

```sh
const axios = require('axios');

axios.post('http://localhost:5000/translate', {
  text: 'Hello, World!',
  srcLang: 'en',
  destLang: 'es'
})
.then(response => {
  console.log('Translated Text:', response.data.translatedText);
})
.catch(error => {
  console.error('Error:', error.response.data);
});
```

This sends a POST request to the translation endpoint, logging the translated text.

### Running the Bun API
Start the Server: 
```sh
bun start
```
Translation Endpoint
```sh
http://localhost:5000/translate
```

Send a POST request to /translate with the following JSON body:

```sh
example: {
  "text": "Hello, World!",
  "srcLang": "en",
  "destLang": "es"
}
```
Using Curl 

```sh
curl -X POST http://localhost:5000/translate \
-H "Content-Type: application/json" \
-d '{"text": "Hello, World!", "srcLang": "en", "destLang": "es"}'

```

### Credits
- Utilizes the [Google Translate API](https://pypi.org/project/googletrans) for comprehensive language translation capabilities.
- Inspired by the global need for accessible, easy-to-integrate text translation tools.
- A heartfelt thank you to the open-source community for continuous contributions and feedback.

## Contributing

We welcome contributions to the PDF Merger project! Please consider contributing in the following ways:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## License

This project is open-source and available for anyone to use at there own risk. 