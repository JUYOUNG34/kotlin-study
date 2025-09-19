package chapter01

fun main() {
    val name: String = "Kotlin"
    var visitCount = 0

    println("Hello, $name")
    visitCount += 1

    val nickname: String? = null
    println(nickname?.uppercase() ?: "No nickname yet")

    println(greet(name))
}

fun greet(name: String): String = "Hello, $name"