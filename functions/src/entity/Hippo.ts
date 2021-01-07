import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
} from "typeorm";

@Entity()
export class Hippo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weight: number;

  @Column()
  createdAt: Date;

  @BeforeInsert()
  addTimestamp() {
    this.createdAt = new Date();
  }
}
