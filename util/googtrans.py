import os
import json 
import re
import googletrans
import codecs

# pip install googletrans==3.1.0a0

translator = googletrans.Translator()
# print(googletrans.LANGUAGES)  

directory_path = "./tmp"

def sortUnique(json_object):
    if json_object and len(json_object):
        sorted_json = {k: json_object[k] for k in sorted(json_object, key=lambda x: x.lower())}
        return sorted_json

def googleTranslate(text, dest):
    translation = translator.translate(text, dest=dest)

    # https://stackoverflow.com/questions/63073788/google-translate-api-returns-non-utf8-characters
    translatedText = codecs.escape_decode(translation.text)[0]
    translatedText = translatedText.decode("utf8")
    # print(f"Translated: {dest} {translatedText}")
    return translatedText

def translateFile(file_name, dest):
    with open(file_name, "r", encoding="utf-8") as f:
        data = json.load(f)

    new_data = {}
    for str in data:
        new_data[str] = googleTranslate(str, dest)

    sorted_data = sortUnique(new_data)

    new_file = file_name.replace(".missing.", ".trans.")
    with open(new_file, "w", encoding="utf-8") as f:
        json.dump(sorted_data, f, indent=4, ensure_ascii=False)
    print(f"Translated: {new_file}")

pattern = r'package\.nls\.([a-z\-]+)\.missing' 

for file_name in os.listdir("./tmp"):
    if file_name.startswith("package.nls."):
        matches = re.findall(pattern, file_name)
        if matches:
            dest = matches[0]
            if dest == "pt-br":
                dest = "pt"
            elif dest == "zh":
                dest = "zh-cn"
            translateFile(os.path.join(directory_path, file_name), dest);