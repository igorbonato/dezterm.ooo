with open("./dicio.txt", "r", encoding="utf-8") as f:
    word_list = []
    for x in f:
        x = x.replace("\n", "")
        word_list.append(x)
print(word_list)
