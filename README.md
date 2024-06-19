<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Simple Nestjs API

Simple Nestjs API fue creado usando NestJS, Express, Sequelize y PostgreSQL

## Installation I

Clonar el repositorio y ejecutar `npm install` en la carpeta raiz del proyecto

```bash
npm install
```
## Installation II

- Instalar `PostgreSQL`
- Crear la base de datos a utilizar

## Config

Crear el archivo `.ENV` en la raiz del proyecto y agregar los siguientes datos

```conf
DB_NAME=nombre_de_la_base
DB_USER=user_de_la_base
DB_PASSWORD=password_de_la_base
DB_HOST=localhost
DB_PORT=5432

API_KEY=ABCDFG
```

## Usage

```bash
# watch mode
$ npm run start:dev
```

## Header HTTP

Agregar el apikey en el header de cada solicitud. El `apikey` puede ser modificado si así lo desea

```bash
apikey: abc123
```

## Metodos HTTP

Obtener roles utilizando el metodo `GET`
```bash
http://localhost:3000/api/roles
```

Obtener users utilizando el metodo `GET`
```bash
http://localhost:3000/api/users
```

Obtener users paginado utilizando el metodo `POST`. Metodo especialmente utilizado para paginaciones
```bash
http://localhost:3000/api/users/Filtered
```

Agregar la siguiente estructura en el cuerpo `BODY` de la solicitud `POST` para la paginación.
```json
{
    "search": {
        "value": "ale"
    },
    "start": 0,
    "length": 10
}
```

## Specs

### Models

- Los modelos creados utilizando `sequelize` son los siguientes:

```bash
Users
Roles
UserRoles
```

### Common

- `AuthGuard` para validar las cabeceras de las peticiones `HTTP`

```typescript
//auth.guard.ts
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const apikey = process.env.API_KEY;
    const request = context.switchToHttp().getRequest() as Request;

    if (!request.headers['apikey']) {
      return false;
    } else if (request.headers['apikey'] === apikey) {
      return true;
    } else {
      return false;
    }
  }
}

// app.module.ts
providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AppService]
```

### Security

- Seguridad aplicada a las cabeceras utilizando `helmet`

```typescript
// main.ts
app.use(helmet());
```

### DTOs Validations

- Usar las validaciones de tipado que se describen en los dtos para todos los modulos del proyecto, se aplica `whitelist: true` para evitar que se agreguen campos que no se estan esperando.

```typescript

// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
);

// Ejemplo

//create-user.dto.ts

export class CreateUserDto {
  @IsString({ message: 'El campo name debe ser un string' })
  @IsNotEmpty({ message: 'El campo name no debe estar vacío' })
  @MinLength(4, {
    message: 'El campo name debe contener al menos 4 caracteres',
  })
  name: string;

  @IsEmail(undefined, {
    message: 'El campo email debe contener una dirección válida',
  })
  @IsString({ message: 'El campo email debe ser un string' })
  @IsNotEmpty({ message: 'El campo email no debe estar vacío' })
  @MinLength(4, {
    message: 'El campo email debe contener al menos 4 caracteres',
  })
  email: string;

  @IsNotEmpty({ message: 'El campo password no debe estar vacío' })
  @MinLength(4, {
    message: 'El campo password debe contener al menos 4 caracteres',
  })
  @IsStrongPassword(
    {
      minLength: 4,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message: 'El campo password debe tener al menos 4 caracteres y 1 número',
    },
  )
  password: string;
  roles?: Role[];
}
```

### User Validation Method

- Metodo de validación de usuario para logueo u otro tipo de caso de uso necesario.

```typescript
/**
   * Validar que el usuario exista y validar la contraseña
   * @param validateUserDto
   * @returns "Acceso correcto" || "Contraseña incorrecta" || "El usuario no existe"
   */
  async validateUser(validateUserDto: ValidateUserDto): Promise<string> {
    const { email, password } = validateUserDto;

    console.log(email, password);

    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return 'Acceso correcto';
      } else {
        throw new HttpException(
          'Contraseña incorrecta',
          HttpStatus.BAD_REQUEST,
        );
        // return 'Contraseña incorrecta';
      }
    }

    throw new HttpException('El usuario no existe', HttpStatus.BAD_REQUEST);
  }
```

### User Validation Method - HTTP Request

- Validar el usuario utilizando el metodo `POST`

```bash
localhost:3000/api/users/validateUser
```
Agregar la siguiente estructura en el cuerpo `BODY` de la solicitud `POST` para la validación.
```json
{
    "email": "laura@gmail.com",
    "password": "abc123"
}
```


### HttpExceptions

- Manejo de las excepciones `HTTP`

```typescript
// HttpExceptions - Example
async remove(id: number): Promise<HttpException> {
    const userFound = await this.findOne(id);

    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      await userFound.destroy();
      return new HttpException('Usuario elimiando correctamente', HttpStatus.OK);
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
```

### Sequelize config

- Configuración inicial de Sequelize en el módulo principal

```typescript
//app.module.ts
SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      models: [User, Role, UserRoles],
    }),
```
## Author
Alejandro Grance
