.PHONY: help setup venv install lint test clean

help:
	@echo "setup     - set up python interpreter environment"
	@echo "venv      - create a virtual environment for the project"
	@echo "install   - install all dependencies"
	@echo "lint      - run linter on the project"
	@echo "test      - run pytests"
	@echo "clean     - remove all temporary files"

setup:
	python3 -m venv venv
	@echo ">> virtual environment created."

venv:
	test -d venv || python3 -m venv venv

install: venv
	. venv/bin/activate; pip install -U pip setuptools wheel
	. venv/bin/activate; pip install -r requirements.txt
	@echo ">> dependencies installed."

lint: venv
	. venv/bin/activate; flake8 src tests

test: venv
	. venv/bin/activate; pytest pytests/

clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -delete
	find . -type d -name '*.egg-info' -exec rm -rf {} +
	rm -rf .pytest_cache
	@echo ">> clean."