#!/bin/bash
git clone --single-branch --branch main https://github.com/Ca11back/scf-experiment.git
mv scf-experiment/config.json JD_tencent_scf/
mv scf-experiment/index.js JD_tencent_scf/
mv scf-experiment/serverless.yml JD_tencent_scf/