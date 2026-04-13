from fastapi import APIRouter, Query
from typing import List
import math
import random
from datetime import date, timedelta
from app.schemas.metrics import MetricsResponse, DailyDataPoint, MetricsSummary

router = APIRouter(prefix="/api/metrics", tags=["metrics"])

RANGE_DAYS = {"7d": 7, "30d": 30, "90d": 90, "ytd": 90}


def generate_series(days: int) -> List[DailyDataPoint]:
    series = []
    base = 7200.0
    now = date(2024, 3, 30)

    for i in range(days):
        current_date = now - timedelta(days=(days - 1 - i))
        is_anomaly = (days == 30 and i == 14)
        raw = base + math.sin(i * 0.4) * 800 + random.uniform(-300, 300)
        revenue = round(raw * 2.87 if is_anomaly else raw, 2)
        orders = max(1, round(revenue / 59.1 + random.uniform(-5, 10)))
        aov = round(revenue / orders, 2)
        churn = round(max(0, 2.8 - i * 0.015 + random.uniform(-0.05, 0.1)), 2)
        base += random.uniform(-40, 100)

        # Windows-compatible date formatting
        month_day = current_date.strftime("%b %d").lstrip("0")
        series.append(DailyDataPoint(
            date=month_day,
            revenue=revenue,
            orders=orders,
            aov=aov,
            churn=churn,
            is_anomaly=is_anomaly,
        ))

    return series


@router.get("/", response_model=MetricsResponse)
def get_metrics(range: str = Query("30d")):
    days = RANGE_DAYS.get(range, 30)
    series = generate_series(days)

    total_revenue = round(sum(d.revenue for d in series), 2)
    total_orders = sum(d.orders for d in series)
    avg_aov = round(total_revenue / total_orders, 2) if total_orders else 0
    avg_churn = round(sum(d.churn for d in series) / len(series), 2)

    return MetricsResponse(
        summary=MetricsSummary(
            total_revenue=total_revenue,
            total_orders=total_orders,
            avg_aov=avg_aov,
            avg_churn=avg_churn,
        ),
        series=series,
    )