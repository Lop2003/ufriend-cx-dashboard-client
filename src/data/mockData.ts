import { Customer, Feedback, FollowUp } from '../types';

export const initialCustomers: Customer[] = [
  { id: '1', name: 'กิตติศักดิ์ พรหมสร', phone: '081-234-5678', product: 'iPhone 15 Pro Max', branch: 'ลาดพร้าว', plan_months: 12, status: 'active', created_at: '2025-01-10T08:00:00Z' },
  { id: '2', name: 'มณีรัตน์ วงศ์เทวา', phone: '089-876-5432', product: 'iPad Pro 11"', branch: 'เชียงใหม่ นิมาน', plan_months: 24, status: 'overdue', created_at: '2025-02-15T09:30:00Z' },
  { id: '3', name: 'ปกรณ์ มงคลธนเวช', phone: '085-444-1122', product: 'iPhone 14', branch: 'ขอนแก่น มข.', plan_months: 6, status: 'completed', created_at: '2024-11-20T10:15:00Z' },
  { id: '4', name: 'สุดารัตน์ ใจดีกุล', phone: '086-777-8899', product: 'iPad Air 5', branch: 'ลาดพร้าว', plan_months: 36, status: 'active', created_at: '2025-03-01T14:20:00Z' },
  { id: '5', name: 'อนันต์ ทรัพย์แสนล้าน', phone: '083-999-5566', product: 'iPhone 15', branch: 'หาดใหญ่ เซ็นทรัล', plan_months: 24, status: 'overdue', created_at: '2025-01-20T11:00:00Z' },
  { id: '6', name: 'ชลดา เลิศวรวิทย์', phone: '082-111-3344', product: 'iPhone 15 Pro Max', branch: 'ชลบุรี อมตะ', plan_months: 12, status: 'active', created_at: '2025-02-28T09:00:00Z' },
  { id: '7', name: 'ธนพล เกษมศิริ', phone: '087-555-6677', product: 'iPad 10.2"', branch: 'เชียงใหม่ นิมาน', plan_months: 12, status: 'completed', created_at: '2024-10-15T15:45:00Z' },
  { id: '8', name: 'ภัทรา วรรณสิงห์', phone: '084-222-7788', product: 'iPhone 13', branch: 'หาดใหญ่ เซ็นทรัล', plan_months: 18, status: 'active', created_at: '2025-03-10T13:10:00Z' },
  { id: '9', name: 'สมชาย รักชาติ', phone: '088-333-4455', product: 'iPhone 15 Pro Max', branch: 'ขอนแก่น มข.', plan_months: 6, status: 'overdue', created_at: '2025-02-05T16:00:00Z' },
  { id: '10', name: 'ศิริพร บุญยืน', phone: '089-111-2233', product: 'iPad Air 5', branch: 'ชลบุรี อมตะ', plan_months: 12, status: 'active', created_at: '2025-03-12T10:30:00Z' }
];

export const initialFeedbacks: Feedback[] = [
  { id: 'f1', customer_id: '1', rating: 5, comment: 'เจ้าหน้าที่บริการรวดเร็วมาก อนุมัติไวผ่านง่ายดีค่ะ', category: 'service', sentiment: 'positive', created_at: '2025-01-15T10:00:00Z' },
  { id: 'f2', customer_id: '2', rating: 2, comment: 'ไม่มีพนักงานโทรแจ้งเตือนล่วงหน้า ก่อนปรับยอดเป็นค้างชำระ ดอกเบี้ยแอบแพง', category: 'payment', sentiment: 'negative', created_at: '2025-03-02T11:30:00Z' },
  { id: 'f3', customer_id: '3', rating: 4, comment: 'เครื่องใช้งานได้ดีมาก เงื่อนไขตรงตามสัญญา พนักงานสาขาน่ารัก', category: 'product', sentiment: 'positive', created_at: '2025-01-05T14:00:00Z' },
  { id: 'f4', customer_id: '4', rating: 5, comment: 'ใช้บัตรประชาชนใบเดียวจริงๆ สะดวกรวดเร็วประทับใจค่ะ', category: 'service', sentiment: 'positive', created_at: '2025-03-05T15:20:00Z' },
  { id: 'f5', customer_id: '5', rating: 1, comment: 'พนักงานโทรทวงถามยอดเงินพูดจาไม่สุภาพเลย แย่มากๆ ควรตักเตือนด่วน', category: 'service', sentiment: 'negative', created_at: '2025-02-20T09:15:00Z' },
  { id: 'f6', customer_id: '6', rating: 3, comment: 'เครื่องผ่อนดีค่ะ แต่สาขาหาที่จอดรถค่อนข้างยากเวลามารับเครื่อง', category: 'branch', sentiment: 'neutral', created_at: '2025-03-01T10:45:00Z' }
];

export const initialFollowUps: FollowUp[] = [
  { id: 'w1', customer_id: '2', type: 'payment_remind', note: 'โทรเตือนยอดค้างชำระ ลูกค้าแจ้งว่าจะรีบจ่ายภายในวันศุกร์นี้ผ่านแอป', status: 'pending', created_at: '2025-03-10T09:00:00Z' },
  { id: 'w2', customer_id: '5', type: 'feedback_reply', note: 'โทรติดต่อกลับเพื่อขออภัยเรื่องพนักงานทวงถามพูดจาไม่ดี แจ้งเรื่องตรวจสอบพนักงานรายดังกล่าวแล้ว', status: 'done', created_at: '2025-02-22T14:30:00Z' }
];
