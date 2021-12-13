test:
ifeq ($(scope), frontend)
	yarn workspace feast-frontend run test
else ifeq ($(scope), lambda)
	yarn workspace feast-lambda run test
else
	yarn test
endif

deploy-frontend:
	yarn workspace feast-frontend build && yarn workspace feast-frontend deploy
