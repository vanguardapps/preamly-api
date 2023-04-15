#!/bin/bash

# note: /home/roy/services/kafka/bin has been added to $PATH, which is why the following works
# without full paths to the kakfa *.sh files

# if using this script in another environment, just make sure all the *.sh scripts have permissions
# set to execute via chmod and replace the following script filenames with your direct paths

# launch zookeeper
gnome-terminal -- zookeeper-server-start.sh /home/roy/services/kafka/config/zookeeper.properties

# wait while zookeeper boots up (not necessary, but safe)
sleep 10s

# launch kakfa server
gnome-terminal -- kafka-server-start.sh /home/roy/services/kafka/config/server.properties

# wait while kakfa server boots up (almost necessary)
sleep 10s

# create the default topic. I have it set to 'RoymMessage' -- change this to what you like
gnome-terminal -- kafka-topics.sh --create --topic RoyMessages --bootstrap-server localhost:9092
