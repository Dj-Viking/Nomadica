PROD="production";
echo "NODE_ENV IS $NODE_ENV";

if [ "$NODE_ENV" = "$PROD" ]; then
  cd server; node index.mjs;
elif ! [ "$NODE_ENV" = "$PROD" ]; then
  cd server; npm run dev;
fi