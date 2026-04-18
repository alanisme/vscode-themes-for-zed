.PHONY: all convert validate audit fmt fmt-check check clean

all: convert validate audit

convert:
	npm run convert

validate:
	@npm run validate

audit:
	@npm run audit

fmt:
	@npm run fmt

fmt-check:
	@npm run fmt:check

check:
	@npm run check

clean:
	rm -f themes/*.json
