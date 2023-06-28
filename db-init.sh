echo $MONGO_INITDB_ROOT_USERNAME
echo $MONGO_INITDB_ROOT_PASSWORD
echo $MONGO_API_USER

mongo -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" admin <<EOF
    use $MONGO_API_DB;
    db.createUser({
        user: '$MONGO_API_USER',
        pwd: '$MONGO_API_PASS',
        roles: ["readWrite"],
    });
EOF
