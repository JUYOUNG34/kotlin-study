package chapter03

data class Person(val name: String, val age: Int)

/* 1. 타입 변환 (Type Conversion)

- 코틀린의 명시적 타입 변환 설명
- toLong(), toFloat(), toDouble(), toString() 예제. */

fun typeConversionExample() {
    val number1 = 3
    println("원본 Int 값: $number1")

    // 암시적 변환 불가 - 컴파일 에러
    // val number2: Long = number1

    // 명시적 변환 필요
    val number2: Long = number1.toLong()
    println("Long으로 변환: $number2")

    // 다양한 타입 변환 예제
    val floatValue = number1.toFloat()
    val doubleValue = number1.toDouble()
    val stringValue = number1.toString()

    println("Float 변환: $floatValue")
    println("Double 변환: $doubleValue")
    println("String 변환: $stringValue")
}

/* 2. null 처리

- is 연산자를 통한 타입 체크
- as? 연산자를 통한 안전한 캐스팅
- nullable 타입 처리 방법 */

fun nullHandlingExample() {
    val person = Person("골프", 27)

    // 1. is 연산자로 타입 체크
    printAgeIfPersonNotNull(person)
    printAgeIfPersonNotNull("문자열") // Person이 아닌 경우

    // 2. nullable 타입 처리
    printAgeIfPersonNullable(person)
    printAgeIfPersonNullable(null)
    printAgeIfPersonNullable("문자열")
}

/* 3. 문자열 템플릿

- 기본 변수 삽입: $variable
- 복합 표현식: ${expression}
- 멀티라인 문자열과 trimIndent() */

fun stringTemplateExample() {
    val person = Person("골프", 27)
    val name = "노경태"

    // 기본 문자열 템플릿
    println("단순 변수: $name")
    println("복합 표현식: ${person.name}, 나이: ${person.age}")

    // 멀티라인 문자열
    val multiLineStr = """
        이름: ${person.name}
        나이: ${person.age}
        설명: 이것은 멀티라인 문자열입니다.
        특수문자도 그대로: "Hello", 'World'
    """.trimIndent()

    println("멀티라인 문자열:")
    println(multiLineStr)
}



/* 4. 문자열 인덱싱

- 배열처럼 인덱스로 문자 접근
- 문자열 순회 방법 */


fun stringIndexingExample() {
    val str = "ABCDEFG"
    println("문자열: $str")
    println("첫 번째 문자 [0]: ${str[0]}")
    println("세 번째 문자 [2]: ${str[2]}")
    println("마지막 문자: ${str[str.length - 1]}")

    // 문자열 순회
    print("모든 문자: ")
    for (char in str) {
        print("$char ")
    }
    println()
}

/* Any 타입 객체가 Person인지 확인하고 나이 출력 */
fun printAgeIfPersonNotNull(obj: Any) {
    if (obj is Person) {
        println("Person 타입 확인됨 - 나이: ${obj.age}")
    } else {
        println("Person 타입이 아닙니다: ${obj::class.simpleName}")
    }
}

/* nullable 객체를 안전하게 Person으로 캐스팅 */
fun printAgeIfPersonNullable(obj: Any?) {
    val person = obj as? Person
    if (person != null) {
        println("안전한 캐스팅 성공 - 나이: ${person.age}")
    } else {
        println("null이거나 Person 타입이 아닙니다")
    }
}
