.PHONY: all convert validate check clean

all: convert validate

convert:
	npm run convert

validate:
	@npm run validate

check:
	@npm run check

clean:
	rm -f themes/*.json
