#!/bin/sh
git rm --cached --ignore-unmatch .env
git rm --cached --ignore-unmatch apps/web/.env
git rm --cached --ignore-unmatch infra/.env
