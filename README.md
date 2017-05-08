# pc-ocr
A website to use an OCR on an image from the phone, and get the result on the pc.

To use the QR-Code you need to define the address in the `config.json` file.
```json
{
  "adress": "example.com",
  "https": false
}
```

pc-ocr use [node-tika](https://github.com/ICIJ/node-tika), it **requires**  JDK 7 and [Tesseract](https://wiki.apache.org/tika/TikaOCR).
You will have to download language packs for your language.
