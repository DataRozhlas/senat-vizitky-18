
# coding: utf-8

# In[58]:


import pandas as pd
import json
import os
import numpy as np


# In[50]:


serk = pd.read_excel('./vizitky.xlsx')


# In[51]:


serk.poznamka.fillna('', inplace=True)
serk.zvuk.fillna('', inplace=True)


# In[52]:


out = {}
for kand in serk.values:
    if kand[0] not in out:
        out[kand[0]] = {}
    out[kand[0]][kand[1]] = {
        'jmeno': kand[3] + ' ' + kand[4],
        'povolani': kand[8],
        'partaj': kand[25],
        'file': kand[26],
        'afile': kand[27],
        'pozn': kand[28]
    }


# In[63]:


done = []
for fle in os.listdir('../media/foto'):
    try:
        done.append(int(fle.split('_')[0]))
    except:
        pass


# In[64]:


np.unique(done)


# In[54]:


with open('../js/data.js', 'w', encoding='utf-8') as f:
    f.write('var data = ' + json.dumps(out) + ';')

