from pydantic import BaseModel
from typing import List


class DailyDataPoint(BaseModel):
    date:       str
    revenue:    float
    orders:     int
    aov:        float
    churn:      float
    is_anomaly: bool = False


class MetricsSummary(BaseModel):
    total_revenue: float
    total_orders:  int
    avg_aov:       float
    avg_churn:     float


class MetricsResponse(BaseModel):
    summary: MetricsSummary
    series:  List[DailyDataPoint]