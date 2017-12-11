print "Started"

import requests 
var = "CODICE"
r = requests.post("https://api.amazon.com/auth/o2/token", data={'grant_type': 'authorization_code', 'code': var, 'client_id': 'Client_ID', 'client_secret':'Client_Secret','redirect_uri':'https://192.168.1.35:8100/authresponse'}) 
data = r.json() 
print data

if 'access_token' not in data:
	print "no data from amazon"
	exit(0)

accesstoken = data['access_token'] 
token = 'Bearer ' + accesstoken 
print token
x = requests.post("https://dash-replenishment-service-na.amazon.com/replenish/Slot_id", headers={'Authorization': token, 'x-amzn-accept-type': 'com.amazon.dash.replenishment.DrsReplenishResult@1.0', 'x-amzn-type-version': 'com.amazon.dash.replenishment.DrsReplenishInput@1.0'}) 
