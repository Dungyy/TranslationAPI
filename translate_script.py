import sys
from googletrans import Translator, LANGUAGES

def translate_text(text, src_lang, dest_lang):
    translator = Translator()
    # Check if the language codes are valid
    if src_lang not in LANGUAGES or dest_lang not in LANGUAGES:
        raise ValueError("Invalid language code, Try Another One!")
    translation = translator.translate(text, src=src_lang, dest=dest_lang)
    return translation.text

if __name__ == "__main__":
    try:
        # create temporary file containing the text
        file_path = sys.argv[1]
        source_language = sys.argv[2]
        destination_language = sys.argv[3]
        
        # Read the text from the file
        with open(file_path, 'r', encoding='utf-8') as file:
            input_text = file.read()
            
        # translate the text
        translated_text = translate_text(input_text, source_language, destination_language)
        
        # Print the result to stdout to be captured by Node.js
        print(translated_text, end='')
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
