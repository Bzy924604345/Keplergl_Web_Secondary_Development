# 读取数据
import pandas as pd
data = pd.read_csv("C:\\Users\\DMK\\Desktop\\merge_2425\\2019\\20191225_USA.csv")
result = []
temp = []

for i in range(len(data)):
    for j in range(len(data.columns)):
        temp.append(data.iloc[i,j])
    result.append(temp)
    temp=[]

fields = data.columns

#固定语句
label = "test"
id = "testdata"
s=str("export default {\n\tinfo:{\n\t\tlabel: '") + str(label) + str("',\n\t\tid: '") + str(id) + str("'\n\t},\n\tdata:{\n\t\tfields: [\n")

# 写入 JavaScript 文件
with open('C:\\Users\\DMK\\Desktop\\merge_2425\\20191225_USA.js', 'w') as jsfile:
    jsfile.write(s)

    jsfile.write("\t\t\t{name:'id'},\n")
    for i in range(len(fields)):
        if(i!=len(fields)-1):
            jsfile.write(str("\t\t\t{name:'")+str(fields[i])+str("'},\n"))
        else:
            jsfile.write(str("\t\t\t{name:'")+str(fields[i])+str("'}\n"))

    jsfile.write("\t\t],\n")
    jsfile.write("\t\trows:[\n")

    for i in range(len(result)):
        jsfile.write(str("\t\t\t[")+str(i+1)+str(",")),
        for j in range(len(fields)):
            if j == 8:
                jsfile.write(str("'")+str(result[i][j])+str("'"))
            elif j in range(4,8):
                jsfile.write(str("'")+str(result[i][j])+str("'")+str(","))
            elif j != len(fields) - 1:
                jsfile.write(str(result[i][j])+str(","))
            else:
                jsfile.write(str(result[i][j]))
        print("第%d行已转换成功"%i)
        if i != len(result)-1:
            jsfile.write("],\n")
        else:
            jsfile.write("]\n")

    jsfile.write("\t\t]\n")
    jsfile.write("\t}\n")
    jsfile.write("};")