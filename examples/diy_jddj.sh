# diy.sh增加京东到家
echo 'DIY:Adding JDDJ'
git clone --single-branch --branch main https://github.com/passerby-b/JDDJ.git
rm -rf JDDJ/jddj_getck.js
mv JDDJ/jddj* JD_tencent_scf/
mv JDDJ/root.json JD_tencent_scf/
