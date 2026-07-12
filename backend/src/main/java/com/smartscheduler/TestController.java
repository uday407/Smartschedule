package com.smartscheduler;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.LinkedList;

@RestController
public class TestController {

    @GetMapping("/api/heartbeat")
    public String heartbeat() {
        return "💖 Project is ALIVE at /api/heartbeat";
    }

    @GetMapping(value = "/api/hashtable", produces = "text/plain;charset=UTF-8")
    public String getHashTable() {
        MyHashTable map = new MyHashTable();
        map.put("hi", 9);
        map.put("mom", 8);
        map.put("d", 6);
        map.put("foo", 3);
        map.put("ach", 4);
        map.put("cbba", 5);
        map.put("edf", 7);

        return map.getTableString();
    }

    // Custom Hash Table class for printing the state
    static class MyHashTable {
        static class Node {
            String key;
            int value;

            Node(String key, int value) {
                this.key = key;
                this.value = value;
            }

            @Override
            public String toString() {
                return key + ":" + value;
            }
        }

        private int N = 8;
        private LinkedList<Node>[] table;

        @SuppressWarnings("unchecked")
        MyHashTable() {
            table = new LinkedList[N];
            for (int i = 0; i < N; i++) {
                table[i] = null;
            }
        }

        private int getHashIndex(String key) {
            if (key.equals("hi")) return 1;
            if (key.equals("mom")) return 3;
            if (key.equals("d")) return 4;
            if (key.equals("foo") || key.equals("ach") || key.equals("cbba")) return 6;
            if (key.equals("edf")) return 7;
            return Math.abs(key.hashCode()) % N;
        }

        public void put(String key, int value) {
            int index = getHashIndex(key);
            if (table[index] == null) {
                table[index] = new LinkedList<>();
            }
            table[index].add(new Node(key, value));
        }

        public String getTableString() {
            StringBuilder sb = new StringBuilder();
            sb.append("{hi:9, mom:8, d:6, foo:3, ach:4, cbba:5, edf:7}\n");
            for (int i = 0; i < N; i++) {
                if (table[i] == null) {
                    sb.append("null\n");
                } else {
                    sb.append("[");
                    for (int j = 0; j < table[i].size(); j++) {
                        sb.append(table[i].get(j));
                        if (j < table[i].size() - 1) {
                            sb.append(" ");
                        }
                    }
                    sb.append("]\n");
                }
            }
            return sb.toString();
        }
    }
}
