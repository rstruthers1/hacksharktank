# Digital Ocean Droplet Setup

## Introduction
Based on [Launching your Startup on a Droplet](https://medium.com/@danstarns/launching-your-startup-on-a-droplet-feb43f9810a)

Made changes, so writing down the steps here.

## Domain
### Get a domain name
Got the domain name from godaddy.com: hackteamhub.com

### Point the domain name to Digital Ocean
* Log into godaddy.com
* My Products -> Click on domain tile
* Click on Domain in side menu
* Click on Manage DNS
* Click on Nameservers
* Click on Change Nameservers
* Enter these nameservers:
  * ns1.digitalocean.com
  * ns2.digitalocean.com
  * ns3.digitalocean.com


## Create Droplet
* Log into Digital Ocean
* Create a Project. Mine is called Hack Team Hub
* Create a Droplet
  * Ubuntu 20.04 (LTS) x64
  * Standard
  * Datacenter Region: New York
  * Use bare minimum resources for now
  * Set root password
  * Name: hack-team-hub-droplet
  * Add improved metrics monitoring and alerting (free)
* Press Create Droplet
* Wait for it to be created

## SSH into Droplet and create new user
Log into the droplet via web console

Create a new user:
```shell
sudo adduser github
usermod -a -G sudo github
```

Log out of the droplet

## Create SSH keys
Log into the droplet via web console using user `github`

Start SSH for this user and Droplet IP. Replace DROPLET_IP with the ipv4 address of the droplet:
```shell  
$ ssh github@DROPLET_IP
```

Type in yes when prompted to add the host to the list of known hosts. Then enter the password for the `github` user.

Generate the public and private keys:
```shell
ssh-keygen
```

Press enter to accept the default location and name for the keys. Leave passphrase blank.

List the contents of the .ssh directory:
```shell  
ls -al ~/.ssh
```


Append the contents of the public key file to the authorized_keys file:
```shell  
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
``` 

Give the authorized_keys file the correct permissions:
```shell  
chmod 700 ~/.ssh/authorized_keys
```

Reload the SSH daemon:
```shell
sudo systemctl reload sshd
``` 

Add OpenSSH to the allow list for the firewall:
```shell
sudo ufw allow OpenSSH
```

Enable the firewall:
```shell
sudo ufw enable
```

Check the status of the firewall:
```shell
sudo ufw status
```

Add the keys to your GitHub repository's secrets.

Copy the private key:
```shell
cat ~/.ssh/id_rsa
``` 

Go to your repository, navigate to the secrets/actions section, and add the three following key values:

* SSH_HOST=YOUR_DROPLET_IP
* SSH_KEY=COPIED_PRIVATE_KEY
* SSH_USERNAME=github

## DNS
In Digital Ocean, go to you project and click on Create -> Domain/DNS

Enter the domain name you purchased from godaddy.com

Click on Add Domain

Add two 'A' name records.

**A name record one:**
* hostname: @
* directs to: DROPLET IP

**A name record two:**
* hostname: www
* directs to: DROPLET IP

## Install node and pm2
Log into the droplet via web console using user `github`

Install node:
```shell
sudo apt update
sudo apt install nodejs
```

This will install an old version of node. Install nvm and switch to a newer version of node:
```shell
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm ls-remote # get versions
nvm install 18.19.0 # or whatever version you want
nvm use 18.19.0  
```

Create a simple node application:
```shell
mkdir ~/hack-team-hub
cd ~/hack-team-hub
npm init -y
npm install express
```

Create file index.js:
```shell
vi index.js
```

Add the following to index.js:
```javascript
var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});
```

Save and exit the file.

Install pm2:
```shell
npm install pm2 -g
```

Run the application:
```shell
pm2 start index.js --name my-app
```


## NGINX
Log into the droplet via web console using user `github`

Install NGINX:
```shell
sudo apt update
sudo apt install nginx
```

Update the firewall to allow HTTP and HTTPS traffic:
```shell
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx Full'
``` 

Check the status of the firewall:
```shell
sudo ufw status
```

Go to your domain name in a browser. You should see the NGINX welcome page.


Remove the default config file:
```shell
sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-available/default
```

Create a new config file:
```shell
sudo vi /etc/nginx/sites-available/hackteamhub.com
``` 

Add the following to the new file:
```shell
server {
    listen 80;
    server_name example.com www.example.com;  # Replace with your domain name

    location / {
        proxy_pass http://localhost:5000;  # Forward requests to Node.js application on port 5000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Optional: Handle static files directly with Nginx
    # Uncomment and modify if you have static files in a public directory
    # location /public/ {
    #     root /path/to/your/node/app;  # Path to the root of your Node.js app
    #     try_files $uri $uri/ =404;
    # }
}
```

Save and exit the file.

Create a symbolic link in the /etc/nginx/sites-enabled/ directory to enable this configuration.
Run the following command:
```shell
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled
```

Verify that the configuration file is valid:
```shell
sudo nginx -t
```

Restart NGINX:
```shell
sudo systemctl restart nginx
```

## Certbot
Install Certbot:
```shell
sudo apt-get update
sudo apt install certbot python3-certbot-nginx
```

Obtain a certificate:
```shell
sudo certbot --nginx
```

1. Enter your email address and agree to the terms of service.
2. Select all domains listed by hitting enter.
3. Choose option 2: Secure - Make all requests redirect to secure HTTPS access
4. Go to your webserver in a browser. You should "Hello World!" displayed.

## Have pm2 start the app after GitHub action deploys it
Delete my-app
```shell
pm2 delete my-app
pm2 save --force
```

Run pm2 command to start the app installed by GitHub actions
```shell
cd ~/hack-team-hub
pm2 start server/src/index.js --name my-app --update-env
pm2 save
pm2 stop my-app # the deploy job will restart the app
```
















