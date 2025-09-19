# Repository Guidelines

## Project Structure & Module Organization
The Kotlin codebase lives in `src/main/kotlin`, structured by chapter folders such as `chapter01`. Shared assets such as configuration files or templates belong in `src/main/resources`. Place automated tests in `src/test/kotlin`, mirroring the package layout of the code under test. The Gradle wrapper (`gradlew`, `gradlew.bat`, `gradle/`) and Kotlin build scripts stay at the project root. JavaScript utilities (`tech-stack-analysis.js`, `website-analysis.js`, `safe-tech-analysis.js`) and `node_modules/` support Playwright-based research and should remain isolated from the Kotlin source.

## Build, Test, and Development Commands
Use `./gradlew build` to compile the Kotlin sources and run all verification tasks. Run `./gradlew test` for a faster feedback cycle when you only need the unit tests executed via JUnit 5. `./gradlew clean` removes generated outputs before a fresh build. For the JavaScript helpers, install native deps with `npm install` and run ad hoc checks with `npx playwright test` when browser automation scripts are introduced.

## Coding Style & Naming Conventions
Follow Kotlin's official style guide: four-space indentation, `PascalCase` for classes and objects, `camelCase` for functions and properties, and `SCREAMING_SNAKE_CASE` for constants. Keep each package name lowercase. Favor data classes or sealed hierarchies when modeling immutable domain concepts. When adding scripts, use descriptive file names like `chapter02-overview.js`.

## Testing Guidelines
Write tests alongside features in `src/test/kotlin`, mirroring the package name—for example, production class `chapter01.Person` -> test `chapter01.PersonTest`. Use `kotlin.test` annotations with JUnit Platform runner. Add assertions that cover nullability, edge cases, and regression scenarios. Ensure new features include negative and success-path tests before opening a review.

## Commit & Pull Request Guidelines
Author commits with concise, imperative subjects (e.g., `Add person validation`) and include a short body when context or reasoning matters. Group related changes into a single commit to simplify review. Pull requests should describe the feature or fix, outline testing performed (`./gradlew test`, manual QA), and link relevant issues or discussion threads. Attach screenshots when updating generated assets like `noworrieskorea-screenshot.png`.
