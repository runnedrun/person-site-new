export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
firebase use staging
cp ./private_configs/staging-config.env .env.development
cp ./private_configs/staging-config.env .env.production
# cp ./private_configs/staging-functions-env.env ./.env

unset GCLOUD_PROJECT
unset PROJECT_NAME
unset NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset FIRESTORE_EMULATOR_HOST
unset FIREBASE_DATABASE_EMULATOR_HOST