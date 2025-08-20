import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListSummaryComponent } from './order-list-summary.component';

describe('OrderListSummaryComponent', () => {
  let component: OrderListSummaryComponent;
  let fixture: ComponentFixture<OrderListSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderListSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
