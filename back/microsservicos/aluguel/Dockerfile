FROM dart:stable

WORKDIR /app

COPY . .

RUN dart pub get
RUN dart compile exe bin/aluguel_dart.dart -o bin/server

CMD ["bin/server"]
