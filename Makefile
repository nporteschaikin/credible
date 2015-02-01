NPM = ./node_modules/.bin

%.min.js: %.js check
	@$(NPM)/uglifyjs $< > $@ --comments '/Copyright/' --compress --mangle

deps:
	@npm install

check: deps
	@npm test
