export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
firebase use prod
cp ./private_configs/prod-config.env .env.development
cp ./private_configs/prod-config.env .env.production

unset GCLOUD_PROJECT
unset PROJECT_NAME
unset NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset FIRESTORE_EMULATOR_HOST
unset FIREBASE_DATABASE_EMULATOR_HOST