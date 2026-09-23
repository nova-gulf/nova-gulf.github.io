# Nova Gulf (demo)

A static demonstration website for Nova Gulf, a fictional organization used for
product demonstrations. Nova Gulf is not a real company and none of the services,
partners, or customer stories on this site are real.

- `/`                 corporate home page
- `/contact/`         contact page — enquiry form, mailboxes, and office list
- `/wifi/`            guest Wi-Fi registration with per-purpose consent choices
- `/privacy-center/`  the data subject request types this site accepts
- `/dsr-request/`     the request form, embedded from a hosted privacy platform

All pages send `noindex, nofollow` and `robots.txt` disallows all crawlers.
The contact and Wi-Fi forms have no backend: they run in the browser and send nothing.
