@echo off
echo =========================================
echo Fixing Image URLs in Local Database
echo =========================================
echo.

echo Step 1: Creating database backup...
docker exec riyan_mariadb mysqldump -uroot -prootpassword riyan_nextjs > backup_local_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
echo Backup created
echo.

echo Step 2: Checking how many old URLs exist...
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "SELECT (SELECT COUNT(*) FROM wp_posts WHERE guid LIKE '%%beta.riyan.com.mv%%' OR post_content LIKE '%%beta.riyan.com.mv%%') as posts_count, (SELECT COUNT(*) FROM wp_postmeta WHERE meta_value LIKE '%%beta.riyan.com.mv%%') as postmeta_count;"
echo.

echo Step 3: Updating all URLs from beta.riyan.com.mv to localhost:3000...
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_posts SET guid = REPLACE(guid, 'http://beta.riyan.com.mv', 'http://localhost:3000') WHERE guid LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_posts SET guid = REPLACE(guid, 'https://beta.riyan.com.mv', 'http://localhost:3000') WHERE guid LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_posts SET post_content = REPLACE(post_content, 'http://beta.riyan.com.mv', 'http://localhost:3000') WHERE post_content LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_posts SET post_content = REPLACE(post_content, 'https://beta.riyan.com.mv', 'http://localhost:3000') WHERE post_content LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'http://beta.riyan.com.mv', 'http://localhost:3000') WHERE meta_value LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'https://beta.riyan.com.mv', 'http://localhost:3000') WHERE meta_value LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_options SET option_value = REPLACE(option_value, 'http://beta.riyan.com.mv', 'http://localhost:3000') WHERE option_value LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_options SET option_value = REPLACE(option_value, 'https://beta.riyan.com.mv', 'http://localhost:3000') WHERE option_value LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_revslider_slides SET params = REPLACE(params, 'http://beta.riyan.com.mv', 'http://localhost:3000') WHERE params LIKE '%%beta.riyan.com.mv%%';"
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "UPDATE wp_revslider_slides SET params = REPLACE(params, 'https://beta.riyan.com.mv', 'http://localhost:3000') WHERE params LIKE '%%beta.riyan.com.mv%%';"
echo URLs updated
echo.

echo Step 4: Verifying update...
docker exec riyan_mariadb mysql -uroot -prootpassword riyan_nextjs -e "SELECT 'Remaining beta.riyan.com.mv URLs (should be 0):' as info, (SELECT COUNT(*) FROM wp_posts WHERE guid LIKE '%%beta.riyan.com.mv%%' OR post_content LIKE '%%beta.riyan.com.mv%%') as posts_remaining, (SELECT COUNT(*) FROM wp_postmeta WHERE meta_value LIKE '%%beta.riyan.com.mv%%') as postmeta_remaining;"
echo.

echo Step 5: Restarting web container...
docker restart riyan_web
echo Web container restarted
echo.

echo =========================================
echo Image URL update completed!
echo =========================================
echo.
echo Wait 10-15 seconds, then visit http://localhost:3000
echo Check if images are loading correctly
echo.

pause
