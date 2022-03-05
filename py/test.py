import requests

url = 'http://200.17.137.109:8081/novobsi/Members/cicerog/disciplinas/introducao-a-programacao/arquivos-2016-1/algoritmos/Lista-de-Palavras.txt'
r = requests.get(url)
with open("./dicio.txt", "wb") as f:
    f.write(r.content)
    with open("./dicio.txt", "r", encoding="utf-8") as f:
        word_list = [x.replace("\n", "",) for x in f if len(x) == 7]
        with open("./dicio3.txt", "w", encoding="utf-8") as r:
            for t in word_list:
                r.write(t.lower() + "\n")
print(word_list)
