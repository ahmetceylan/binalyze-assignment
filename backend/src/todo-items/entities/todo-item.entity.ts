import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { TodoGroup } from '../../todo-groups/entities/todo-group.entity';
import { User } from '../../users/entities/user.entity';

@Entity('todoItems')
export class TodoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  priority: number;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => TodoGroup, (todoGroup) => todoGroup.todoItems, {
    onDelete: 'CASCADE',
  })
  group: TodoGroup;

  @ManyToOne(() => User, (user) => user.todoItems)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
