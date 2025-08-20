import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPriceSummaryComponent } from './order-price-summary.component';

describe('OrderPriceSummaryComponent', () => {
  let component: OrderPriceSummaryComponent;
  let fixture: ComponentFixture<OrderPriceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPriceSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPriceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
