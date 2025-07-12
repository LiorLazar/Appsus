import { mailService } from "../services/mail.service.js"

const { useState, useEffect } = React

export function MailSort() {

    const [orderItems, setOrderItems] = useState(null)
    useEffect(() => {
        loadOrderItems()
    }, [orderItems])

    function loadOrderItems() {
        mailService.getOrderItems()
    }

    return (
        <section className="mail-sort">
            <h2>Sort By:</h2>

        </section>
    )
}