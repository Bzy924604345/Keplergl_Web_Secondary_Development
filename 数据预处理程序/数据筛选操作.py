#!/usr/bin/env python
# coding: utf-8

# In[73]:


import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
import numpy as np
import time


# # 对日期进行筛选

# In[102]:


file1= pd.read_csv("F:\\南师\\课程\\kepler\\data_input_day\\month\\flightlist_20201201_20201231.csv")


# In[75]:


# print(file1)


# In[103]:


file1=np.array(file1)
# print(file1)


# In[121]:


data=[]
for item in file1:
    sh= item[9] 
    if "2020-12-31 00:00:00+00:00" ==sh:
        print(item)
        data.append(item) 


# In[122]:


data_df=pd.DataFrame(data)
data_df.columns=['callsign','number','icao24','registration','typecode','origin','destination','firstseen','lastseen','day','latitude_1','longitude_1','altitude_1','latitude_2','longitude_2','altitude_2']
data_df.to_excel("F:\\南师\\课程\\kepler\\data_input_day\\202012\\20201231.xlsx",index=False)


# # 对USA范围数据进行筛选

# In[106]:


# 指定需要读取的列和数据类型
dtypes = {
 "firstseen":time,
 "lastseen":time,
 "day":time,
 "latitude_1": float,
 "longitude_1": float,
 "latitude_2": float,
 "longitude_2": float,
}


# In[123]:


# 读取筛选过日期之后的excel文件，并指定数据类型

#改！！！！！！！！！
file_path='F:\\南师\\课程\\kepler\\data_input_day\\202012\\20201231.xlsx'
df=pd.read_excel(file_path)

# 读取合并geojson文件
USA = gpd.read_file('E:\\南狮\\大三下\\地图设计与电子地图学\\实践\\实践\\data\\美国范围数据提取\\draw_USA.geojson')

in_USA = []
for index, row in df.iterrows():
    # 控制循环数量
    if index > 800000:
        break
    firstseen=row["firstseen"]
    lastseen=row["lastseen"]
    day=row["day"]
    point1 = Point(row["longitude_1"], row["latitude_1"])
    point2 = Point(row["longitude_2"], row["latitude_2"])
    num_polygons1 = USA.contains(point1).sum()
    num_polygons2 = USA.contains(point2).sum()
    if (num_polygons1 > 0) and (num_polygons2 > 0):
        print(firstseen,lastseen,day,point1.y,point1.x,point2.y,point2.x)
        in_USA.append(row)

        # 将筛选后的数据保存到CSV文件
in_USA_df = pd.DataFrame(in_USA)

##改！！！！！！！！
in_USA_df.to_csv("F:\\南师\\课程\\kepler\\data_output_day\\20201231_USA.csv", index=False,header=True)


# In[ ]:




