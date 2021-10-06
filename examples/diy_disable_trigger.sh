# 数字为行号,切换触发器为disable
sed -i '37s/\(enable: \)true/\1false/g' jd_dwg/serverless.yml
sed -i '43s/\(enable: \)true/\1false/g' jd_dwg/serverless.yml
sed -i '49s/\(enable: \)true/\1false/g' jd_dwg/serverless.yml
