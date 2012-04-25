
test:
	@rm -rf test/out/*
	@./node_modules/.bin/mocha --ui tdd

.PHONY: test
