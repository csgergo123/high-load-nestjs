apt update -y
mkdir /home/high-load
cd /home/high-load/
git clone https://github.com/csgergo123/high-load-nestjs.git
mkdir stress-test/
cd stress-test/
wget https://github.com/hogejo/high-load-stress/releases/download/v8.3.1/high-load-stress-8.3.1.jar

# Install docker

sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-cache policy docker-ce
sudo apt install docker-ce
