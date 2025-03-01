import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TodoItem } from '../../todo-items/entities/todo-item.entity';

@Entity('todoGroups')
export class TodoGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.todoGroups)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.group)
  todoItems: TodoItem[];

  @UpdateDateColumn()
  updated_at: Date;
}
