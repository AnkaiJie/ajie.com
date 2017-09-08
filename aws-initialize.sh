curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 8.4.0
sudo yum -y install git
git clone https://github.com/AnkaiJie/ajie.com.git
cd ~/ajie.com
npm install -g grunt
npm install -g grunt-cli
npm install -g bower
npm install
bower install
sudo nohup /home/ec2-user/.nvm/versions/node/v8.4.0/bin/node src/server.js > /dev/null &
