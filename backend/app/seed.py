from app.database import SessionLocal, engine, Base
from app.models import Product, Order, Customer, Campaign
from app.models.user import User
from app.auth import hash_password
import uuid


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear all existing data
    db.query(Campaign).delete()
    db.query(Order).delete()
    db.query(Customer).delete()
    db.query(Product).delete()
    db.query(User).delete()
    db.commit()

    # ── Seed demo users ──────────────────────────────────────────────────────
    demo_users = [
        User(
            id              = str(uuid.uuid4()),
            name            = "Tenson M.",
            email           = "tenson@merchant.io",
            hashed_password = hash_password("demo1234"),
            plan            = "growth",
            avatar          = "TM",
            is_active       = True,
        ),
        User(
            id              = str(uuid.uuid4()),
            name            = "Admin User",
            email           = "admin@merchant.io",
            hashed_password = hash_password("admin123"),
            plan            = "pro",
            avatar          = "AU",
            is_active       = True,
        ),
    ]
    db.add_all(demo_users)
    db.commit()

    # ── Seed products ────────────────────────────────────────────────────────
    products = [
        Product(id="1", name="Pro Wireless Headphones", category="Electronics", sales=892,  revenue=71360, delta=8.2),
        Product(id="2", name="Ergonomic Desk Chair",    category="Furniture",   sales=341,  revenue=58970, delta=14.7),
        Product(id="3", name="Mechanical Keyboard",     category="Electronics", sales=654,  revenue=45780, delta=-2.1),
        Product(id="4", name="USB-C Hub (7-port)",      category="Accessories", sales=1203, revenue=36090, delta=22.3),
        Product(id="5", name="Monitor Stand",           category="Furniture",   sales=477,  revenue=19080, delta=5.6),
    ]
    db.add_all(products)

    # ── Seed orders ──────────────────────────────────────────────────────────
    orders = [
        Order(id="#48291", customer="Alex Mwale",       amount=247.00, status="completed", date="Mar 30"),
        Order(id="#48290", customer="Sarah Chen",       amount=89.99,  status="pending",   date="Mar 30"),
        Order(id="#48289", customer="James Osei",       amount=412.50, status="completed", date="Mar 29"),
        Order(id="#48288", customer="Maria Santos",     amount=63.00,  status="refunded",  date="Mar 29"),
        Order(id="#48287", customer="Tom Nakamura",     amount=188.00, status="completed", date="Mar 28"),
        Order(id="#48286", customer="Fatima Al-Hassan", amount=320.00, status="completed", date="Mar 28"),
        Order(id="#48285", customer="David Park",       amount=55.50,  status="pending",   date="Mar 27"),
        Order(id="#48284", customer="Chioma Eze",       amount=740.00, status="completed", date="Mar 27"),
    ]
    db.add_all(orders)

    # ── Seed customers ───────────────────────────────────────────────────────
    customers = [
        Customer(id="c1",  name="Alex Mwale",       email="alex@email.com",   country="Zambia",       total_spend=2840,  orders=12, last_order="Mar 30", status="active"),
        Customer(id="c2",  name="Sarah Chen",       email="sarah@email.com",  country="China",        total_spend=1290,  orders=6,  last_order="Mar 30", status="active"),
        Customer(id="c3",  name="James Osei",       email="james@email.com",  country="Ghana",        total_spend=4120,  orders=18, last_order="Mar 29", status="active"),
        Customer(id="c4",  name="Maria Santos",     email="maria@email.com",  country="Brazil",       total_spend=340,   orders=2,  last_order="Mar 29", status="at-risk"),
        Customer(id="c5",  name="Tom Nakamura",     email="tom@email.com",    country="Japan",        total_spend=6780,  orders=31, last_order="Mar 28", status="active"),
        Customer(id="c6",  name="Fatima Al-Hassan", email="fatima@email.com", country="UAE",          total_spend=5200,  orders=24, last_order="Mar 28", status="active"),
        Customer(id="c7",  name="David Park",       email="david@email.com",  country="South Korea",  total_spend=890,   orders=4,  last_order="Feb 14", status="at-risk"),
        Customer(id="c8",  name="Chioma Eze",       email="chioma@email.com", country="Nigeria",      total_spend=9100,  orders=44, last_order="Mar 27", status="active"),
        Customer(id="c9",  name="Lucas Bernard",    email="lucas@email.com",  country="France",       total_spend=210,   orders=1,  last_order="Jan 05", status="churned"),
        Customer(id="c10", name="Amara Diallo",     email="amara@email.com",  country="Senegal",      total_spend=1540,  orders=8,  last_order="Mar 25", status="active"),
        Customer(id="c11", name="Nina Petrova",     email="nina@email.com",   country="Russia",       total_spend=3300,  orders=15, last_order="Mar 20", status="active"),
        Customer(id="c12", name="Omar Hassan",      email="omar@email.com",   country="Egypt",        total_spend=450,   orders=3,  last_order="Jan 18", status="churned"),
    ]
    db.add_all(customers)

    # ── Seed campaigns ───────────────────────────────────────────────────────
    campaigns = [
        Campaign(id="camp1", name="Spring Sale Email Blast",    channel="email",  status="completed", budget=2000, spent=1840, impressions=48200,  clicks=3840, conversions=412, revenue=24720, start_date="Mar 01", end_date="Mar 15"),
        Campaign(id="camp2", name="Google Ads — Headphones",    channel="paid",   status="active",    budget=5000, spent=3120, impressions=124000, clicks=6200, conversions=310, revenue=18600, start_date="Mar 10", end_date="Apr 10"),
        Campaign(id="camp3", name="Instagram Reels — Chairs",   channel="social", status="active",    budget=1500, spent=890,  impressions=84000,  clicks=2100, conversions=98,  revenue=8820,  start_date="Mar 20", end_date="Apr 20"),
        Campaign(id="camp4", name="SMS Flash Sale",             channel="sms",    status="completed", budget=800,  spent=800,  impressions=12400,  clicks=1860, conversions=224, revenue=13440, start_date="Mar 15", end_date="Mar 15"),
        Campaign(id="camp5", name="Retargeting — Cart Abandon", channel="paid",   status="paused",    budget=3000, spent=1200, impressions=56000,  clicks=2800, conversions=140, revenue=8400,  start_date="Mar 05", end_date="Apr 05"),
    ]
    db.add_all(campaigns)

    db.commit()
    db.close()
    print("✅ Database seeded successfully.")


if __name__ == "__main__":
    seed()