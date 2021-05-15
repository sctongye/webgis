exf:
	docker-compose exec frontend sh
exb:
	docker-compose exec backend sh
mkm:
	docker-compose run --rm backend python manage.py makemigrations
mgr:
	docker-compose run --rm backend python manage.py migrate
nib:
	docker network inspect bridge