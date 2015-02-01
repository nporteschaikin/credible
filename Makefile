NPM = ./node_modules/.bin

%.min.js: %.js check
	@$(NPM)/uglifyjs $< > $@ --compress --mangle

deps:
	@npm install

check: deps
	@npm test
